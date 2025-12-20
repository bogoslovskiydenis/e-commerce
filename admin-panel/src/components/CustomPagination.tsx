import React from 'react';
import { Pagination } from 'react-admin';

const CustomPagination = () => (
    <Pagination rowsPerPageOptions={[5, 10, 50, 100]} />
);

export default CustomPagination;