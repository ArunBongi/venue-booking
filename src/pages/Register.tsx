import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Navbar } from "@/components/Navbar";

const Register = () => {
  return (
    <>
      <Navbar />
      <AuthLayout
        title="Create an account"
        subtitle="Enter your details to get started"
        alternativeText="Already have an account?"
        alternativeLink="/login"
        alternativeLinkText="Login"
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default Register;