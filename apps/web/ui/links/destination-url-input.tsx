"use client";

import useWorkspace from "@/lib/swr/use-workspace";
import { DomainProps } from "@/lib/types";
import {
  AnimatedSizeContainer,
  InfoTooltip,
  SimpleTooltipContent,
  useMediaQuery,
} from "@dub/ui";
import {
  forwardRef,
  HTMLProps,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { AlertCircleFill } from "../shared/icons";
import { ProBadgeTooltip } from "../shared/pro-badge-tooltip";

type DestinationUrlInputProps = {
  _key?: string;
  domain?: string;
  domains: DomainProps[];
  error?: string;
  showEnterToSubmit?: boolean;
} & HTMLProps<HTMLInputElement>;

export const DestinationUrlInput = forwardRef<
  HTMLInputElement,
  DestinationUrlInputProps
>(
  (
    {
      _key: key,
      domain,
      domains,
      error,
      showEnterToSubmit = true,
      ...inputProps
    }: DestinationUrlInputProps,
    ref,
  ) => {
    const inputId = useId();
    const { isMobile } = useMediaQuery();
    const [debouncedUrl] = useDebounce(inputProps.value, 500);
    const [duplicateLinks, setDuplicateLinks] = useState<string[]>([]);
    const { id: workspaceId } = useWorkspace();
    const [prevUrl, setPrevUrl] = useState<string | undefined>();
    const isInitialMount = useRef(true);

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      if (debouncedUrl && debouncedUrl !== prevUrl) {
        setPrevUrl(debouncedUrl.toString());
        fetch(
          `/api/links/verify/destination-url?url=${encodeURIComponent(debouncedUrl.toString())}&workspaceId=${workspaceId}`,
        )
          .then((res) => res.json())
          .then((data) => {
            setDuplicateLinks(data.exists ? [data.link] : []);
          });
      } else if (!debouncedUrl) {
        setDuplicateLinks([]);
      }
    }, [debouncedUrl, workspaceId]);

    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700"
            >
              Destination URL
            </label>
            {key === "_root" ? (
              <ProBadgeTooltip
                content={
                  <SimpleTooltipContent
                    title="The URL your users will get redirected to when they visit your root domain link."
                    cta="Learn more."
                    href="https://dub.co/help/article/how-to-redirect-root-domain"
                  />
                }
              />
            ) : (
              <InfoTooltip
                content={
                  <SimpleTooltipContent
                    title="The URL your users will get redirected to when they visit your short link."
                    cta="Learn more."
                    href="https://dub.co/help/article/how-to-create-link"
                  />
                }
              />
            )}
          </div>
          {showEnterToSubmit && (
            <div className="animate-text-appear text-xs font-normal text-gray-500">
              press <strong>Enter</strong> ↵ to submit
            </div>
          )}
        </div>
        <div className="relative mt-2 flex rounded-md shadow-sm">
          <input
            ref={ref}
            name="url"
            id={inputId}
            placeholder={
              domains?.find(({ slug }) => slug === domain)?.placeholder ||
              "https://dub.co/help/article/what-is-dub"
            }
            autoFocus={!key && !isMobile}
            autoComplete="off"
            className={`${
              error
                ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
            } block w-full rounded-md focus:outline-none sm:text-sm`}
            aria-invalid="true"
            {...inputProps}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircleFill
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <AnimatedSizeContainer>
          {duplicateLinks.length > 0 && (
            <DuplicateLinksWarning links={duplicateLinks} />
          )}
        </AnimatedSizeContainer>
        {error && (
          <p className="mt-2 text-sm text-red-600" id="key-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

const DuplicateLinksWarning = ({ links }) => (
  <div className="mt-2 rounded-md bg-yellow-50 p-3">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertCircleFill
          className="h-5 w-5 text-yellow-400"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">
          Duplicate links found
        </h3>
      </div>
    </div>
  </div>
);
