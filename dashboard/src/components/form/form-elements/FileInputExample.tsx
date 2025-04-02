import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

export default function FileInputExample() {
  const handleFileChange = (event) => {
    const file = event.files?.[0]; // PrimeReact's FileUpload component uses `files`
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  return (
    <ComponentCard title="File Input">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Upload file</label>
        <FileUpload
          id="file-upload"
          name="file"
          customUpload
          uploadHandler={handleFileChange}
          className="custom-class"
          chooseLabel="Choose a file"
        />
      </div>
    </ComponentCard>
  );
}
