import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Badge from '../../components/ui/badge/Badge';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard';
import React from 'react';

export default function Badges() {
  return (
    <div>
      <PageMeta
        title="React.js Badges Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Badges Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="With Light Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="light" color="primary" startIcon={null} endIcon={null}>
              Primary
            </Badge>
            <Badge variant="light" color="success" startIcon={null} endIcon={null}>
              Success
            </Badge>{' '}
            <Badge variant="light" color="error" startIcon={null} endIcon={null}>
              Error
            </Badge>{' '}
            <Badge variant="light" color="warning" startIcon={null} endIcon={null}>
              Warning
            </Badge>{' '}
            <Badge variant="light" color="info" startIcon={null} endIcon={null}>
              Info
            </Badge>
            <Badge variant="light" color="light" startIcon={null} endIcon={null}>
              Light
            </Badge>
            <Badge variant="light" color="dark" startIcon={null} endIcon={null}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="With Solid Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="solid" color="primary" startIcon={null} endIcon={null}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" startIcon={null} endIcon={null}>
              Success
            </Badge>{' '}
            <Badge variant="solid" color="error" startIcon={null} endIcon={null}>
              Error
            </Badge>{' '}
            <Badge variant="solid" color="warning" startIcon={null} endIcon={null}>
              Warning
            </Badge>{' '}
            <Badge variant="solid" color="info" startIcon={null} endIcon={null}>
              Info
            </Badge>
            <Badge variant="solid" color="light" startIcon={null} endIcon={null}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" startIcon={null} endIcon={null}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Left Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" startIcon={<i className='pi-plus' />} endIcon={null}>
              Primary
            </Badge>
            <Badge variant="light" color="success" startIcon={<i className='pi-plus' />} endIcon={null}>
              Success
            </Badge>{' '}
            <Badge variant="light" color="error" startIcon={<i className='pi-plus' />} endIcon={null}>
              Error
            </Badge>{' '}
            <Badge variant="light" color="warning" startIcon={<i className='pi-plus' />} endIcon={null}>
              Warning
            </Badge>{' '}
            <Badge variant="light" color="info" startIcon={<i className='pi-plus' />} endIcon={null}>
              Info
            </Badge>
            <Badge variant="light" color="light" startIcon={<i className='pi-plus' />} endIcon={null}>
              Light
            </Badge>
            <Badge variant="light" color="dark" startIcon={<i className='pi-plus' />} endIcon={null}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Left Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" startIcon={<i className='pi-plus' />} endIcon={null}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" startIcon={<i className='pi-plus' />} endIcon={null}>
              Success
            </Badge>{' '}
            <Badge variant="solid" color="error" startIcon={<i className='pi-plus' />} endIcon={null}>
              Error
            </Badge>{' '}
            <Badge variant="solid" color="warning" startIcon={<i className='pi-plus' />} endIcon={null}>
              Warning
            </Badge>{' '}
            <Badge variant="solid" color="info" startIcon={<i className='pi-plus' />} endIcon={null}>
              Info
            </Badge>
            <Badge variant="solid" color="light" startIcon={<i className='pi-plus' />} endIcon={null}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" startIcon={<i className='pi-plus' />} endIcon={null}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Right Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" startIcon={null} endIcon={<i className='pi-plus' />}>
              Primary
            </Badge>
            <Badge variant="light" color="success" startIcon={null} endIcon={<i className='pi-plus' />}>
              Success
            </Badge>{' '}
            <Badge variant="light" color="error" startIcon={null} endIcon={<i className='pi-plus' />}>
              Error
            </Badge>{' '}
            <Badge variant="light" color="warning" startIcon={null} endIcon={<i className='pi-plus' />}>
              Warning
            </Badge>{' '}
            <Badge variant="light" color="info" startIcon={null} endIcon={<i className='pi-plus' />}>
              Info
            </Badge>
            <Badge variant="light" color="light" startIcon={null} endIcon={<i className='pi-plus' />}>
              Light
            </Badge>
            <Badge variant="light" color="dark" startIcon={null} endIcon={<i className='pi-plus' />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Right Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" startIcon={null} endIcon={<i className='pi-plus' />}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" startIcon={null} endIcon={<i className='pi-plus' />}>
              Success
            </Badge>{' '}
            <Badge variant="solid" color="error" startIcon={null} endIcon={<i className='pi-plus' />}>
              Error
            </Badge>{' '}
            <Badge variant="solid" color="warning" startIcon={null} endIcon={<i className='pi-plus' />}>
              Warning
            </Badge>{' '}
            <Badge variant="solid" color="info" startIcon={null} endIcon={<i className='pi-plus' />}>
              Info
            </Badge>
            <Badge variant="solid" color="light" startIcon={null} endIcon={<i className='pi-plus' />}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" startIcon={null} endIcon={<i className='pi-plus' />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
