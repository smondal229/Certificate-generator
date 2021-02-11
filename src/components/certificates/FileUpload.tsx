import { Box, Button, Input, Tooltip } from '@chakra-ui/react';
import React from 'react';
import CSVReader from "react-csv-reader";
import './certificates.css';


//@ts-ignore
const FileUpload = ({ onChange, handleForce, onSubmit, imgData, csvData, csvInfo }) => {
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_")
  };

  return (
    <Box display="flex" w="100%" h="75vh" justifyContent="center" alignItems="center">
      <form onSubmit={onSubmit}>
        <Box w="100%" display="flex" flexDirection="column" alignItems="center">
          {csvInfo.name && <Box mb={2} color="#008085" fontWeight={700}>File Name: {csvInfo.name}</Box>}
          {csvData.length > 0 && <Box mb={2} fontWeight={700} color="#555">{`Available Fields: (${Object.keys(csvData[0]).join(', ')})`}</Box>}
          <Button colorScheme="teal" mb={3}>
            <label htmlFor="react-csv-reader-input" className="image-input-label">
              Choose CSV
            </label>
          </Button>
          <CSVReader
            cssClass="react-csv-input"
            onFileLoaded={handleForce}
            parserOptions={papaparseOptions}
          />

          {imgData && <Box my={2}><img src={imgData} alt="certificate" width="200" /></Box>}
          { /* @ts-ignore */ }
          <Button colorScheme="teal">
            <label htmlFor="image_input" className="image-input-label">
              Choose Image
            </label>
          </Button>
          <Input onChange={onChange} style={{ display: 'none' }} id="image_input" type="file" accept="image/*" required />


          <Tooltip shouldWrapChildren label={!imgData || (csvData.length === 0) ? 'Upload files properly' : 'Continue' } placement="bottom">
            <Button type="submit" disabled={!imgData || (csvData.length === 0)} colorScheme="blue" mt={5} >Continue</Button>
          </Tooltip>
        </Box>
      </form>
    </Box>
  )
}

export default FileUpload;
