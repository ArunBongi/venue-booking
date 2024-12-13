import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your details to get started"
      alternativeText="Already have an account?"
      alternativeLink="/login"
      alternativeLinkText="Login"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;