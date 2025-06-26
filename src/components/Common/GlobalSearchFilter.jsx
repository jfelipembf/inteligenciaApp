import React, { useState } from 'react';
import { Col } from 'reactstrap';

const JobListGlobalFilter = ({ setGlobalFilter }) => {
    const handleSelectStatus = (ele) => {
        const selectedValue = ele.value;
        setGlobalFilter(selectedValue === 'all' ? '' : selectedValue);
    }
    return (
        <React.Fragment>
            <Col xxl={3} lg={6}>
                <select className="form-control select2 mb-3 mb-xxl-0" defaultValue="Status" onChange={(e) => handleSelectStatus(e.target)}>
                    <option disabled>Status</option>
                    <option value="all">Todos</option>
                    <option value="Active">Ativo</option>
                    <option value="New">Novo</option>
                    <option value="Close">Fechado</option>
                </select>
            </Col>
            <Col xxl={3} lg={6}>
                <select className="form-control select2 mb-3 mb-xxl-0" defaultValue="Select Type" onChange={(e) => handleSelectStatus(e.target)}>
                    <option disabled>Selecionar Tipo</option>
                    <option value="all">Todos</option>
                    <option value="Full Time">Tempo Integral</option>
                    <option value="Part Time">Meio Período</option>
                </select>
            </Col>
        </React.Fragment>
    )
};
export default JobListGlobalFilter;
