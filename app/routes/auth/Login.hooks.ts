/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { SignInMethod, signIn } from "../../core/firebase.js";

/**
 * Handles login / signup via Email
 */
export function useHandleSubmit(
  state: State,
  setState: SetState,
): [submit: React.FormEventHandler, inFlight: boolean] {
  const [inFlight, setInFlight] = React.useState(false);

  const submit: React.FormEventHandler = React.useCallback(
    async (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      setInFlight(true); // Indicate that an async operation is in progress
      try {
        if (!state.otpSent) {
          // If OTP hasn't been sent, call the function to send it
          await sendOTP(state.email);
          setState((prev) => ({ ...prev, otpSent: true })); // Indicate that OTP has been sent
        } else {
          // If OTP has been sent, call the function to verify it
          const userCredential: UserCredential = await verifyOTP(
            state.email,
            state.code,
          );
          console.log(userCredential); // Placeholder for success action, e.g., redirect or show success message
          // Optionally, update state here with success information
        }
      } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : String(error),
        }));
      } finally {
        setInFlight(false); // Reset the in-flight status regardless of outcome
      }
    },
    [state.email, state.code, state.otpSent, setState],
  );

  return [submit, inFlight];
}

/**
 * The initial state of the Login component
 */
export function useState() {
  return React.useState({
    email: "",
    code: "",
    saml: false,
    otpSent: undefined as boolean | null | undefined,
    error: undefined as string | null | undefined,
  });
}

export function useHandleChange(setState: SetState) {
  return React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target as Input;
      setState((prev) =>
        prev[name] === value ? prev : { ...prev, [name]: value },
      );
    },
    [setState],
  );
}

export function useSwitchSAML(setState: SetState) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setState((prev) => ({
        ...prev,
        saml: !prev.saml,
        otpSent: false,
        code: "",
      }));
    },
    [setState],
  );
}

export function useHandleSignIn(setState: SetState) {
  const navigate = useNavigate();

  return React.useCallback(
    async function (event: React.MouseEvent<HTMLElement>) {
      try {
        const method = event.currentTarget.dataset.method as SignInMethod;
        const credential = await signIn({ method });
        if (credential.user) {
          setState((prev) => (prev.error ? { ...prev, error: null } : prev));
          navigate("/");
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Login failed.";
        setState((prev) => ({ ...prev, error }));
      }
    },
    [navigate, setState],
  );
}

export type Mode = "login" | "signup";
export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
