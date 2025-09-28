'use client';

import { useState, useActionState, useEffect, use } from "react";
import { suburbListSchema } from '@/app/lib/models/suburb';
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { australiaPostClient as client } from "@/app/lib/apollo/apolloClient";
import { set } from "zod";

export default function RegisterForm() {
  const [postcode, setPostcode] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");

  // 👉 Helpers to manage cookies
  function setFormCookie(data: any) {
    document.cookie = `formSession=${encodeURIComponent(
      JSON.stringify(data)
    )}; path=/;`;
  }

  function getFormCookie() {
    const match = document.cookie.match(/(^| )formSession=([^;]+)/);
    return match ? JSON.parse(decodeURIComponent(match[2])) : null;
  }

  const VERIFY_SUBURB = gql`
    query VerifySuburb($postcode: String, $suburb: String, $state: String) {
      searchPostcode(postcode: $postcode, suburb: $suburb, state: $state) {
        id
        category
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
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if (data) {
      console.log("Data received:", data);
      checkVerification(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log("Error received:", error);
    }
  }, [error]);

  useEffect(() => {
    const saved = getFormCookie();
    if (saved) {
      setPostcode(saved.postcode || "");
      setSuburb(saved.suburb || "");
      setState(saved.state || "");
    }
  }, []);


  const [isVerified, setIsVerified] = useState(false);
  const [verificationErrors, setVerificationErrors] = useState<any>(null);

  function checkVerification(data: any) {
    if (!data?.searchPostcode?.length) {
      if (postcode && state) {
        setIsVerified(false);
        setVerificationErrors(`The postcode ${postcode} does not exist in the state ${state}.`);
      }
      else if (suburb && state) {
        setIsVerified(false);
        setVerificationErrors(`The suburb ${suburb} does not exist in the state ${state}.`);
      }
      else if (postcode) {
        setIsVerified(false);
        setVerificationErrors(`The postcode ${postcode} does not exist.`);
      }
      else if (suburb) {
        setIsVerified(false);
        setVerificationErrors(`The suburb ${suburb} does not exist.`);
      }
      return;
    }
    const localities = suburbListSchema.safeParse(data?.searchPostcode);
    if (!localities.success) {
      console.log("Validation failed:", localities.error.message );
      setVerificationErrors("");
      setIsVerified(false);
      return;
    }

    if (suburb && postcode) {
      const matchedPostCodeToSuburb = localities.data.find(
        (s) =>
          s.postcode === postcode &&
          s.location?.toLowerCase() === suburb.toLowerCase()
      );
      if (!matchedPostCodeToSuburb) {
        setIsVerified(false);
        setVerificationErrors(`The postcode ${postcode} does not match the suburb ${suburb}.`);
        return;
      }
    }

    setIsVerified(true);
    setVerificationErrors(null);
    return;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Loading status:", loading);
    setFormCookie({ postcode, suburb, state });
    setVerificationErrors(null);
    setIsVerified(false);
    if (!postcode && !suburb) {
      setVerificationErrors("Please enter either a postcode or a suburb.");
      setIsVerified(false);
      return;
    }
    runSearch({ variables: { postcode: postcode, suburb: suburb, state: state } });
    console.log("Loading completed:", loading);
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 
          focus:border-blue-500 sm:text-sm"
          value={state}
					onChange={(e) => setState(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium 
        text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Verify
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">There was an error while trying to verify: {error.message}</p>}
      {verificationErrors && <p className="text-red-500">{verificationErrors}</p>}
      {isVerified && <p className="text-green-500">The postcode, suburb, and state input are valid.</p>}
    </form>
  );
}