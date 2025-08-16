"use client";

import * as Select from "@radix-ui/react-select";
import * as Checkbox from "@radix-ui/react-checkbox";
import { ChevronDownIcon, CheckIcon, FileIcon } from "@radix-ui/react-icons";
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormStateReturn,
} from "react-hook-form";

import React from "react";
import { cn } from "@/utils/utils";
import { ISelectOption } from "@/types/globalFormTypes";
import { IFieldDefinition } from "@/types/globalFormTypes";
import SignaturePanel from "@/components/SignaturePanel";
import { FilesIcon, XCircleIcon } from "lucide-react";

export const renderInput = <T extends FieldValues>(
  formField: IFieldDefinition<T>,
  field: ControllerRenderProps<T, Path<T>>,
  fieldState: ControllerFieldState,
  register: UseFormRegister<Record<string, unknown>>,
  formState: UseFormStateReturn<T>,
) => {
  const baseInputProps = {
    placeholder: formField.placeholder,
    disabled: field.disabled,
    className: formField.className,
  };

  switch (formField.type) {
    case "textarea":
      return (
        <textarea
          {...field}
          {...baseInputProps}
          rows={formField.rows || 3}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            formField.className,
            fieldState.error &&
              "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        />
      );

    case "select":
      const normalizedOptions =
        formField.options?.map((option: string | ISelectOption) =>
          typeof option === "string"
            ? { value: option, label: option }
            : { value: option.value, label: option.label },
        ) || [];

      return (
        <Select.Root
          {...field}
          onValueChange={field.onChange}
          value={field.value ?? ""} // Default to empty string instead of undefined
        >
          <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Select.Value
              placeholder={formField.placeholder || "Select an option"}
            />
            <Select.Icon className="h-4 w-4 opacity-50">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
              <Select.Viewport className="p-1">
                {normalizedOptions.map((option: ISelectOption) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      fieldState.error &&
                        "border-destructive focus:border-destructive focus:ring-destructive",
                    )}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Select.ItemIndicator>
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </span>
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      );

    case "checkbox":
      return (
        <div className="mb-5 grid grid-cols-[35px_1fr] gap-5">
          <Checkbox.Root
            {...field}
            id={String(field.name)}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            disabled={field.disabled}
            className={cn(
              "border-1 flex h-[25px] w-[25px] rounded-sm border-primary bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-accent data-[state=checked]:text-primary",
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          >
            <Checkbox.Indicator className="flex">
              <CheckIcon className="flex h-[25px] w-[25px] bg-secondary text-primary" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label
            htmlFor={String(field.name)}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formField.label}
          </label>
        </div>
      );

    case "number":
      return (
        <input
          {...field}
          {...baseInputProps}
          type="number"
          step={formField.step}
          min={formField.min || formField.zodConfig?.min}
          max={formField.max || formField.zodConfig?.max}
          value={field.value ?? ""} // Default to empty string for number inputs
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            field.onChange(value === "" ? undefined : Number(value));
          }}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            formField.className,
            fieldState.error &&
              "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        />
      );

    case "date":
    case "time":
    case "datetime-local":
    case "month":
    case "week":
      return (
        <input
          {...field}
          type={formField.type}
          min={formField.min}
          max={formField.max}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            formField.className,
            fieldState.error &&
              "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        />
      );

    case "range":
      return (
        <div className="flex items-center space-x-4">
          <input
            {...field}
            {...baseInputProps}
            type="range"
            min={formField.min || formField.zodConfig?.min}
            max={formField.max || formField.zodConfig?.max}
            defaultValue={(formField.default as number) ?? 0}
            step={formField.step}
            className={cn(
              "h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200",
              formField.className,
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          />
          <span className="min-w-[3rem] text-sm text-gray-600">
            {field.value ?? formField.min ?? 0}
          </span>
        </div>
      );

    case "color":
      return (
        <div className="flex items-center space-x-2">
          <input
            {...field}
            {...baseInputProps}
            type="color"
            className={cn(
              "h-10 w-16 cursor-pointer rounded-md border border-input bg-background disabled:cursor-not-allowed disabled:opacity-50",
              formField.className,
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          />
          <span className="text-sm text-gray-600">
            {field.value || "#000000"}
          </span>
        </div>
      );

    case "file":
      return (
        <div className="space-y-2">
          <input
            {...field}
            {...baseInputProps}
            type="file"
            accept={formField.accept}
            multiple={formField.multiple}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                if (formField.multiple) {
                  const fileArray = Array.from(files);
                  field.onChange(fileArray);
                } else {
                  const singleFile = files[0];
                  field.onChange(singleFile);
                }
              } else {
                field.onChange(formField.multiple ? [] : undefined);
              }
            }}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              formField.className,
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          />

          {/* Display thumbnails for uploaded files */}
          {field.value && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formField.multiple ? (
                Array.isArray(field.value) && field.value.length > 0 ? (
                  field.value.map((file: File, index: number) => (
                    <div key={index} className={cn("relative")}>
                      {file.type && file.type.startsWith("image/") ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-20 w-20 rounded border object-cover lg:h-30 lg:w-30"
                          />
                          <XCircleIcon
                            onClick={() => {
                              const newFiles = Array.isArray(field.value)
                                ? field.value.filter(
                                    (_: File, i: number) => i !== index,
                                  )
                                : [];
                              field.onChange(newFiles);
                            }}
                            className={
                              "absolute right-0 top-0 m-1 block text-destructive"
                            }
                          />
                        </div>
                      ) : (
                        <div className="relative flex h-20 w-20 flex-col items-center justify-center overflow-clip rounded-lg bg-secondary text-center align-middle text-xs">
                          <FilesIcon size={25} />
                          {file.name}
                          <XCircleIcon
                            onClick={() => {
                              const newFiles = Array.isArray(field.value)
                                ? field.value.filter(
                                    (_: File, i: number) => i !== index,
                                  )
                                : [];
                              field.onChange(newFiles);
                            }}
                            className={
                              "absolute right-0 top-0 m-1 block text-destructive"
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : null
              ) : // Single file: value should be a File object
              field.value &&
                typeof field.value === "object" &&
                "name" in field.value &&
                "type" in field.value ? (
                <div className="relative">
                  {(field.value as File).type &&
                  (field.value as File).type.startsWith("image/") ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(field.value as File)}
                        alt={(field.value as File).name}
                        className="h-20 w-20 rounded border object-cover"
                      />
                      <XCircleIcon
                        onClick={() => {
                          const newFiles = null;
                          field.onChange(newFiles);
                        }}
                        className={
                          "absolute right-0 top-0 m-1 block text-destructive"
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded border bg-primary p-1 text-center text-xs">
                      {(field.value as File).name}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      );

    case "signature":
      return (
        <div className="space-y-2">
          <div
            className={cn(
              "text-sm text-gray-500",
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          >
            <SignaturePanel
              {...field}
              id={formField.name}
              {...register(formField.name, { required: formField.required })}
              props={{}}
              onSignatureChange={(sigUrl) => {
                field.onChange(sigUrl);
                console.dir(field);
              }}
              onReset={() => field.onChange("")}
            />
          </div>
        </div>
      );

    case "radio":
      const radioOptions =
        formField.options?.map((option: string | ISelectOption) =>
          typeof option === "string"
            ? { value: option, label: option }
            : { value: option.value, label: option.label },
        ) || [];

      return (
        <div className="space-y-2">
          {radioOptions.map((option: ISelectOption) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                {...field}
                type="radio"
                id={`${String(field.name)}-${option.value}`}
                name={String(field.name)}
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
                disabled={field.disabled}
                className={cn(
                  "h-4 w-4 border-gray-300 text-primary focus:ring-primary",
                  fieldState.error &&
                    "border-destructive focus:border-destructive focus:ring-destructive",
                )}
              />
              <label
                htmlFor={`${String(field.name)}-${option.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center space-x-2">
          <button
            {...field}
            type="button"
            role="switch"
            aria-checked={field.value ?? false}
            onClick={() => field.onChange(!formField)}
            disabled={field.disabled}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              field.value ? "bg-primary" : "bg-gray-200",
              field.disabled && "cursor-not-allowed opacity-50",
              fieldState.error &&
                "border-destructive focus:border-destructive focus:ring-destructive",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                field.value ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {formField.label}
          </label>
        </div>
      );

    case "hidden":
      return <input {...field} type="hidden" />;

    case "email":
    case "url":
    case "tel":
    case "search":
    case "password":
    case "text":
    default:
      return (
        <input
          {...field}
          {...baseInputProps}
          type={formField.type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            formField.className,
            fieldState.error &&
              "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        />
      );
  }
};
