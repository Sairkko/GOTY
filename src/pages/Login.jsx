import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../contexts/DarkModeContext.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonIcon, SunIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import {UserContext} from "../contexts/UserContext.jsx";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (values) => {
        const result = await login(values);
        if (result.success) {
            navigate("/", { state: {fromLogin: true}});
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string()
            .min(6, 'Le mot de passe doit avoir au moins 6 caractères')
            .required('Mot de passe requis')
    });

    return (
        <div className="bg-white dark:bg-gray-900 transition-all">
            <ToastContainer />

            <div className="flex justify-center p-4">
                <button
                    onClick={toggleDarkMode}
                    className="flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    {darkMode ? (
                        <SunIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <MoonIcon className="w-5 h-5 text-gray-500" />
                    )}
                </button>
            </div>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6 px-8 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email:</label>
                            <Field
                                type="email"
                                name="email"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mot de passe:</label>
                            <div className="relative">
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-200"
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5 dark:text-black" /> : <EyeIcon className="w-5 h-5 dark:text-black" />}
                                </button>
                            </div>
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
