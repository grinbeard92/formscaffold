/**
 * Book Form Router - Generated from FormConfiguration
 * This demonstrates how to use the dynamic form router with your book form
 */
import { createDynamicFormRouter } from './dynamicForm';
import { demoFormConfiguration } from '@/components/form/DemoFormConfiguration';

// Create the book router using the form configuration
export const bookRouter = createDynamicFormRouter(demoFormConfiguration);

// Export the router type for type safety
export type BookRouter = typeof bookRouter;
