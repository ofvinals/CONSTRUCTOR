/* eslint-disable react/prop-types */
import { Accordion } from 'react-bootstrap';
import { FormInput } from '../../../../utils/Form';

const PresentismAccordion = ({ presentism, register, errors }) => (
  <Accordion.Item eventKey='2'>
    <Accordion.Header>
      <p className='text-xl text-black font-bold'>Presentismo</p>
    </Accordion.Header>
    <Accordion.Body>
      <FormInput
        label='Valor Presentismo'
        name='presentism'
        type='number'
        register={register}
        defaultValue={presentism.hourlyRate}
        customClass={true}
        errors={errors}
      />
    </Accordion.Body>
  </Accordion.Item>
);

export default PresentismAccordion;
