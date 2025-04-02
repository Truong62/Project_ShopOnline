import { Button } from 'primereact/button';
import { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import React from 'react';

export default function TextAreaInput() {
  const [message, setMessage] = useState('');
  const [messageTwo, setMessageTwo] = useState('');

  return (
    <ComponentCard title="Textarea input field">
      <div className="space-y-6">
        {/* Default TextArea */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden"
          />
          <Button icon="pi pi-plus" label="Add" className="p-button-success" />
        </div>

        {/* Disabled TextArea */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <textarea rows={6} disabled className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden bg-gray-100 opacity-50 cursor-not-allowed" />
          <Button icon="pi pi-trash" label="Delete" className="p-button-danger" disabled />
        </div>

        {/* Error TextArea */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <textarea
            value={messageTwo}
            onChange={(e) => setMessageTwo(e.target.value)}
            rows={6}
            className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden border-red-500"
          />
          <Button icon="pi pi-exclamation-circle" label="Error" className="p-button-warning" />
        </div>
      </div>
    </ComponentCard>
  );
}
