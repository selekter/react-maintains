import AppLayout from "../Layouts/AppLayout";
import VehicleForm from "../Components/VehicleForm";

function Form() {
  return (
    <AppLayout>
      <VehicleForm onSubmit={() => { }} />
    </AppLayout>
  );
}

export default Form;
