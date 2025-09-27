'use client';

import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useState, useActionState, useEffect, use } from "react";
import { suburbListSchema } from '@/app/lib/models/suburb';
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { australiaPostClient as client } from "@/app/lib/apollo/apolloClient";

export default function RegisterForm() {
  const [postcode, setPostcode] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");

  const VERIFY_SUBURB = gql`
    query VerifySuburb($postcode: String, $suburb: String, $state: String!) {
      searchPostcode(postcode: $postcode, suburb: $suburb, state: $state) {
        id
        location
        postcode
        state
        latitude
        longitude
      }
    }
  `;

  const [runSearch, { data, loading, error }] = useLazyQuery(VERIFY_SUBURB, {
    client,
  });

  const [isVerified, setIsVerified] = useState(false);
  const [verificationErrors, setVerificationErrors] = useState<any>(null);

  function checkVerification(data: any) {
    const suburbs = suburbListSchema.safeParse(data);
    if (!suburbs.success) {
      console.error("Validation failed:", suburbs.error.message );
      setVerificationErrors("No matching suburb was found.");
      setIsVerified(false);
      return;
    }

    const matched = suburbs.data.find(
      (s) =>
        s.postcode === Number(postcode) &&
        s.location.toLowerCase() === suburb.toLowerCase() &&
        s.state.toLowerCase() === state.toLowerCase()
    );

    if (matched) {
      setIsVerified(true);
      setVerificationErrors(null);
      return;
    } else {
      setIsVerified(false);
      setVerificationErrors("The postcode, suburb, and state do not match.");
      return
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { postcode, suburb, state });
    runSearch({ variables: { postcode: postcode, suburb: suburb, state: state } });
    checkVerification(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
          Postcode
        </label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={postcode}
					onChange={(e) => setPostcode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="suburb" className="block text-sm font-medium text-gray-700">
          Suburb
        </label>
        <input
          type="text"
          id="suburb"
          name="suburb"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={suburb}
					onChange={(e) => setSuburb(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={state}
					onChange={(e) => setState(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading}
      >
        Verify
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">There was an error while trying to verify: {error.message}</p>}
      {isVerified && <p className="text-green-500">The postcode, suburb, and state input are valid.</p>}
    </form>
  );
}