import { Button } from 'primereact/button'

export const Employees = () => {
  return (
    <div>
    <div className='flex flex-row flex-wrap items-center justify-between my-3 mx-2'>
      <h1 className='font-semibold text-xl'>Empleados</h1>
      <div className='gap-2 flex flex-row flex-wrap items-center justify-around w-3/8'>
        <Button className=' hover:bg-yellow-200 p-3 rounded-md'>
          <i className='pi pi-objects-column'></i>
        </Button>
        <Button className=' hover:bg-yellow-200 p-3 rounded-md'>
          <i className='pi pi-list'></i>
        </Button>
        <Button className='btnprimary'>
          <i className='pi pi-plus mr-2'></i> Nuevo Empleado
        </Button>
      </div>
    </div>
  </div>
  )
}
