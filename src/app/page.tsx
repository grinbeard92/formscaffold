import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  PlusIcon,
  MixerHorizontalIcon,
  TableIcon,
  CodeIcon,
  FileIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons';
import { FeatureCard } from '@/components/FeatureCard';
import SubHeader from '@/components/SubHeader';

async function getFormConfigurations() {
  try {
    const configurations = [
      {
        name: 'Demo Form',
        path: '/demo',
        description: 'Comprehensive demonstration of all field types',
      },
      {
        name: 'Maintenance Checklist',
        path: '/maintenance',
        description: 'Annual maintenance checklist form',
      },
    ];
    return configurations;
  } catch (error) {
    console.error('Error loading configurations:', error);
    return [];
  }
}

export default async function HomePage() {
  const configurations = await getFormConfigurations();

  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Quick Actions */}
            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Quick Actions
              </h2>
              <div className='grid gap-4 md:grid-cols-1'>
                <Card.Root className='cursor-pointer transition-shadow hover:shadow-md'>
                  <Link href='/create'>
                    <Card.Header>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 text-primary rounded-full p-2'>
                          <PlusIcon className='h-6 w-6' />
                        </div>
                        <div>
                          <Card.Title>Use Form Builder GUI</Card.Title>
                          <p className='text-muted-foreground mt-1 text-sm'>
                            Create a new form with custom fields and validation
                          </p>
                        </div>
                      </div>
                    </Card.Header>
                  </Link>
                </Card.Root>
              </div>
            </section>

            {/* Existing Forms */}
            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Your Forms
              </h2>
              {configurations.length === 0 ? (
                <Card.Root>
                  <Card.Content className='py-8 text-center'>
                    <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full p-4'>
                      <TableIcon className='text-muted-foreground h-8 w-8' />
                    </div>
                    <h3 className='text-foreground mb-2 text-lg font-medium'>
                      No forms yet
                    </h3>
                    <p className='text-muted-foreground mb-4'>
                      Get started by creating your first form configuration
                    </p>
                    <Link
                      href='/create'
                      className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors'
                    >
                      <PlusIcon className='h-4 w-4' />
                      Create First Form
                    </Link>
                  </Card.Content>
                </Card.Root>
              ) : (
                <div className='grid gap-4'>
                  {configurations.map((config) => (
                    <Card.Root
                      key={config.path}
                      className='transition-shadow hover:shadow-md'
                    >
                      <Card.Header>
                        <div className='flex items-center justify-between'>
                          <div>
                            <Card.Title>{config.name}</Card.Title>
                            <p className='text-muted-foreground mt-1 text-sm'>
                              {config.description}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            <Link
                              href={config.path}
                              className='bg-primary text-primary-foreground hover:bg-primary/80 rounded-md px-3 py-1 text-sm transition-colors'
                            >
                              View Form
                            </Link>
                          </div>
                        </div>
                      </Card.Header>
                    </Card.Root>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Themes
              </h2>
              <Card.Root
                key={'select-theme'}
                className='transition-shadow hover:shadow-md'
              >
                <Card.Header>
                  <Card.Title>Select Theme</Card.Title>
                  {/* <ThemeSwitch /> */}
                </Card.Header>
              </Card.Root>
            </section>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Features */}
            <Card.Root>
              <Card.Header>
                <Card.Title>Features</Card.Title>
              </Card.Header>
              <Card.Content className='space-y-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <div className='rounded bg-green-500/10 p-1 text-green-600'>
                    <CodeIcon className='h-3 w-3' />
                  </div>
                  <span>TypeScript + React Hook Form</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <div className='rounded bg-blue-500/10 p-1 text-blue-600'>
                    <TableIcon className='h-3 w-3' />
                  </div>
                  <span>PostgreSQL Integration</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <div className='rounded bg-purple-500/10 p-1 text-purple-600'>
                    <MixerHorizontalIcon className='h-3 w-3' />
                  </div>
                  <span>Zod Validation</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <div className='rounded bg-orange-500/10 p-1 text-orange-600'>
                    <FileIcon className='h-3 w-3' />
                  </div>
                  <span>File & Image Upload Support</span>
                </div>

                <FeatureCard
                  icon={<Pencil2Icon className='h-3 w-3' />}
                  color={'cyan'}
                  description='E-Signature Pad'
                />
              </Card.Content>
            </Card.Root>

            {/* Quick Links */}
            <Card.Root>
              <Card.Header>
                <Card.Title>Resources</Card.Title>
              </Card.Header>
              <Card.Content className='space-y-2'>
                <Link
                  href='/docs'
                  className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                >
                  Documentation
                </Link>
                <Link
                  href='/examples'
                  className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                >
                  Examples
                </Link>
                <Link
                  href='/api-reference'
                  className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                >
                  API Reference
                </Link>
                <Link
                  href='https://github.com/your-repo'
                  className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                >
                  GitHub Repository
                </Link>
              </Card.Content>
            </Card.Root>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-border bg-card mt-16 border-t'>
        <div className='text-muted-foreground container mx-auto px-4 py-6 text-center'>
          &copy; Grin Beard Solutions 2025 - FormScaffold
        </div>
      </footer>
    </div>
  );
}
