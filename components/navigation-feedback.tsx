"use client";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

const FALLBACK_TIMEOUT = 8000;

function isModifiedClick(event: MouseEvent) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function isInternalNavigationLink(
  anchor: HTMLAnchorElement,
) {
  const rawHref = anchor.getAttribute("href");

  if (
    !rawHref ||
    rawHref.startsWith("#") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("tel:") ||
    rawHref.startsWith("javascript:")
  ) {
    return false;
  }

  if (
    anchor.hasAttribute("download") ||
    anchor.target === "_blank"
  ) {
    return false;
  }

  const destination = new URL(
    anchor.href,
    window.location.href,
  );

  if (
    destination.origin !==
    window.location.origin
  ) {
    return false;
  }

  const currentUrl = new URL(
    window.location.href,
  );

  return (
    destination.pathname !==
      currentUrl.pathname ||
    destination.search !== currentUrl.search
  );
}

export function NavigationFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, setPending] =
    useState(false);

  const timeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  function clearPending() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setPending(false);

    document.body.removeAttribute(
      "data-navigation-pending",
    );

    document
      .querySelectorAll(
        "[data-navigation-clicked='true']",
      )
      .forEach((element) => {
        element.removeAttribute(
          "data-navigation-clicked",
        );
      });

    document
      .querySelectorAll(
        "[data-form-submitting='true']",
      )
      .forEach((element) => {
        element.removeAttribute(
          "data-form-submitting",
        );
      });
  }

  function startPending() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setPending(true);

    document.body.setAttribute(
      "data-navigation-pending",
      "true",
    );

    timeoutRef.current = setTimeout(
      clearPending,
      FALLBACK_TIMEOUT,
    );
  }

  useEffect(() => {
    clearPending();
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(
      event: MouseEvent,
    ) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        isModifiedClick(event)
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor =
        target.closest("a");

      if (
        !(
          anchor instanceof
          HTMLAnchorElement
        ) ||
        !isInternalNavigationLink(anchor)
      ) {
        return;
      }

      anchor.setAttribute(
        "data-navigation-clicked",
        "true",
      );

      startPending();
    }

    function handleSubmit(
      event: SubmitEvent,
    ) {
      if (event.defaultPrevented) {
        return;
      }

      const form = event.target;

      if (
        !(
          form instanceof
          HTMLFormElement
        )
      ) {
        return;
      }

      form.setAttribute(
        "data-form-submitting",
        "true",
      );

      startPending();
    }

    document.addEventListener(
      "click",
      handleClick,
      true,
    );

    document.addEventListener(
      "submit",
      handleSubmit,
      true,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick,
        true,
      );

      document.removeEventListener(
        "submit",
        handleSubmit,
        true,
      );

      if (timeoutRef.current) {
        clearTimeout(
          timeoutRef.current,
        );
      }

      document.body.removeAttribute(
        "data-navigation-pending",
      );
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={`navigation-progress ${
          pending
            ? "navigation-progress--active"
            : ""
        }`}
      >
        <span />
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-label={
          pending
            ? "Loading page"
            : undefined
        }
        className={`navigation-loader ${
          pending
            ? "navigation-loader--active"
            : ""
        }`}
      >
        <span className="navigation-loader__spinner" />

        <span className="navigation-loader__text">
          Loading
        </span>
      </div>
    </>
  );
}