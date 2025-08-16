"use client";

import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import {
  IFormSectionTemplateProps,
  IFieldDefinition,
} from "@/types/globalFormTypes";
import { getFieldRequirements } from "./utils/formSectionUtils";
import { renderInput } from "./utils/renderInputSection";

export const FormSectionTemplate = <T extends FieldValues>({
  title,
  description,
  control,
  register,
  fields,
  errors,
  contentClassName,
  gridCols = "1",
  spacing = "md",
}: IFormSectionTemplateProps<T>) => {
  const gridColsClass = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const spacingClass = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className={cn("space-y-4", contentClassName)}>
        <div
          className={cn("grid", gridColsClass[gridCols], spacingClass[spacing])}
        >
          {fields.map((fieldConfig) => {
            const fieldError = errors[String(fieldConfig.name)];
            return renderFormField(fieldConfig, control, register, fieldError);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const renderFormField = <T extends FieldValues>(
  formField: IFieldDefinition<T>,
  control: Control<T>,
  register: UseFormRegister<Record<string, unknown>>,
  error?: { message?: string },
) => {
  const requirements = getFieldRequirements(formField);

  return (
    <div
      key={String(formField.name)}
      className={formField.type === "hidden" ? "hidden" : "space-y-2"}
    >
      {formField.type !== "checkbox" &&
        formField.type !== "toggle" &&
        formField.type !== "hidden" && (
          <label className="block text-sm font-medium text-foreground">
            {formField.label}
            {formField.required && (
              <span className="ml-1 text-destructive">*</span>
            )}
          </label>
        )}

      <Controller
        name={formField.name}
        control={control}
        defaultValue={formField.default as T[keyof T]} // Use the required default value from field configuration
        render={({ field, fieldState, formState }) =>
          renderInput(formField, field, fieldState, register, formState)
        }
      />

      {formField.description && formField.type !== "hidden" && (
        <p className="text-xs text-muted-foreground">{formField.description}</p>
      )}
      {error && formField.customErrorMessage ? (
        <p
          className="text-sm text-red-500"
          style={{ textShadow: "0 5px 10px rgba(255, 0, 0, 0.5)" }}
        >
          {formField.customErrorMessage}
        </p>
      ) : (
        error && (
          <p
            className="text-sm text-red-500"
            style={{ textShadow: "0 5px 10px rgba(255, 0, 0, 0.5)" }}
          >
            {error.message}
          </p>
        )
      )}

      {formField.type !== "hidden" && (
        <div className="flex justify-end">
          <sub className="text-xs italic text-muted-foreground">
            {requirements.map((req, idx) => (
              <span key={req}>
                {req}
                {idx < requirements.length - 1 && (
                  <span className="mx-1">·</span>
                )}
              </span>
            ))}
          </sub>
        </div>
      )}
    </div>
  );
};

export default FormSectionTemplate;
