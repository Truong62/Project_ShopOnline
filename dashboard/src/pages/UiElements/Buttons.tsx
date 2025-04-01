import React from 'react';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/button/Button';

export default function Buttons() {
  return (
    <div>
      <PageMeta
        title="React.js Buttons Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Buttons Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        {/* Primary Button */}
        <ComponentCard title="Primary Button">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" startIcon={null} endIcon={null} onClick={() => {}}>
              Button Text
            </Button>
            <Button size="md" variant="primary" startIcon={null} endIcon={null} onClick={() => {}}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Primary Button with Start Icon */}
        <ComponentCard title="Primary Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="primary"
              startIcon={<i className=" pi-box size-5" />}
              endIcon={null}
              onClick={() => {}}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="primary"
              startIcon={<i className=" pi-box size-5" />}
              endIcon={null}
              onClick={() => {}}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Primary Button with Start Icon */}
        <ComponentCard title="Primary Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="primary"
              startIcon={null}
              endIcon={<i className="pi-box size-5" />}
              onClick={() => {}}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="primary"
              startIcon={null}
              endIcon={<i className=" pi-box size-5" />}
              onClick={() => {}}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button */}
        <ComponentCard title="Secondary Button">
          <div className="flex items-center gap-5">
            {/* Outline Button */}
            <Button size="sm" variant="outline" startIcon={null} endIcon={null} onClick={() => {}}>
              Button Text
            </Button>
            <Button size="md" variant="outline" startIcon={null} endIcon={null} onClick={() => {}}>
              Button Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline Button with Start Icon */}
        <ComponentCard title="Outline Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="outline"
              startIcon={<i className=" pi-box size-5" />}
              endIcon={null}
              onClick={() => {}}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="outline"
              startIcon={<i className=" pi-box size-5" />}
              endIcon={null}
              onClick={() => {}}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>{' '}
        {/* Outline Button with Start Icon */}
        <ComponentCard title="Outline Button with Right Icon">
          <div className="flex items-center gap-5">
            <Button
              size="sm"
              variant="outline"
              startIcon={null}
              endIcon={<i className=" pi-box size-5" />}
              onClick={() => {}}
            >
              Button Text
            </Button>
            <Button
              size="md"
              variant="outline"
              startIcon={null}
              endIcon={<i className=" pi-box size-5" />}
              onClick={() => {}}
            >
              Button Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
