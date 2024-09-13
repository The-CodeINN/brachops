import { InputForm } from "@/components/pages/createdeployment-form";

const CreateDeployment = () => {
  return (
    <>
      <h1 className="text-lg font-semibold ml-8 mb-10">Deploy Code</h1>
      <div className="container mx-auto flex flex-col items-center justify-start min-h-screen">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 p-2 mb-0">
            Deploy your project
          </h1>
          <p>To deploy a new Project,add your image tag.</p>
          <div className="p-4 border-2 border-gray-300 rounded-md mt-4">
            <InputForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDeployment;
