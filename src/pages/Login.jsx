import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const validationSchema = Yup.object({
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string()
            .min(6, 'Le mot de passe doit avoir au moins 6 caractères')
            .required('Mot de passe requis')
    });

    const handleLogin = (values) => {
        const { email, password } = values;

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && email === storedUser.email && password === storedUser.password) {
            login(storedUser);
            navigate('/', { state: { fromLogin: true } });
        } else {
            toast.error('Identifiants incorrects', {
                autoClose: 3000,
            });
        }
    };

    return (
        <div>
            <ToastContainer />

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email:</label>
                            <Field
                                type="email"
                                name="email"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe:</label>
                            <Field
                                type="password"
                                name="password"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="text-center w-full bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                Se connecter
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
