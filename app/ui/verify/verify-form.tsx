'use client';

import { useState, useActionState, useEffect, use } from "react";
import { suburbListSchema } from '@/app/lib/models/suburb';
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { australiaPostClient as client } from "@/app/lib/apollo/apolloClient";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { set } from "zod";

export default function RegisterForm() {
  const [postcode, setPostcode] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

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

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (data) {
      checkVerification(data);
    }
  }, [data]);

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
    let verificationErrorsString = "";
    const localities = suburbListSchema.safeParse(data?.searchPostcode);
    console.log("Localities:", localities);
    if (!localities.success) {
      setVerificationErrors("There was an error while trying to verify the address. Please try again.");
      setIsVerified(false);
      fillCoordinates(null, null);
      return;
    }

    const matchedPostCodeToSuburb = localities.data.find(
      (s) =>
        s.postcode === postcode &&
        s.location?.toLowerCase() === suburb.toLowerCase()
    );
    if (!matchedPostCodeToSuburb) {
      verificationErrorsString += `The postcode ${postcode} does not match the suburb ${suburb}.\n\n`;
      setIsVerified(false);
      fillCoordinates(null, null);
    }

    if (!data?.searchPostcode?.length) {
      verificationErrorsString += `The suburb ${suburb} does not exist in the state ${state}.\n`;
      setIsVerified(false);
      fillCoordinates(null, null);
    }

    if (matchedPostCodeToSuburb && data?.searchPostcode?.length) {
      fillCoordinates(matchedPostCodeToSuburb.latitude, matchedPostCodeToSuburb.longitude);
      setIsVerified(true);
    }

    if (isVerified) {
      setVerificationErrors(null);
    } else {
      setVerificationErrors(verificationErrorsString.trim());
    }
    return;
  }

  function fillCoordinates(latitude: number | null, longitude: number | null) {
    if (latitude && longitude) {
      setCoordinates({ lat: latitude, lng: longitude });
    } else {
      setCoordinates(null);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormCookie({ postcode, suburb, state });
    setVerificationErrors(null);
    setIsVerified(false);
    if (!postcode || !suburb || !state) {
      setVerificationErrors("Please fill in all fields.");
      setIsVerified(false);
      return;
    }
    runSearch({ variables: { postcode: postcode, suburb: suburb, state: state } });
  };

  return (
    <>
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
        {verificationErrors && <p className="text-red-500 whitespace-pre-line">{verificationErrors}</p>}
        {isVerified && <p className="text-green-500">The postcode, suburb, and state input are valid.</p>}
      </form>
      {/* Map display */}
      {isLoaded && coordinates ? (
        <div className="mt-6 w-full h-96">
          <GoogleMap
            center={coordinates}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={coordinates} />
          </GoogleMap>
        </div>
      ) : coordinates ? (
        <p>Loading map...</p>
      ) : null}
      
    </>
  );
}