import React, { useContext, useState } from 'react'; // Importer useState
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { DarkModeContext } from '../contexts/DarkModeContext.jsx'; // Importer DarkModeContext
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MoonIcon, SunIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Icons for the toggle button

const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // Utiliser le contexte dark mode

    // State pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Nom requis'),
        lastname: Yup.string().required('Prénom requis'),
        username: Yup.string().required('Pseudo requis'),
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string()
            .min(6, 'Le mot de passe doit avoir au moins 6 caractères')
            .required('Mot de passe requis'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
            .required('Confirmation de mot de passe requise')
    });

    const handleRegister = (values) => {
        const { name, email, lastname, username, password } = values;
        if (name && email && lastname && username && password) {
            const userData = { name, email, lastname, username, password };
            localStorage.setItem('user', JSON.stringify(userData));

            login(userData);
            navigate('/auth/login');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 transition-all">

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
                initialValues={{
                    name: '',
                    lastname: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6 px-8 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nom:</label>
                            <Field
                                type="text"
                                name="name"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Prénom:</label>
                            <Field
                                type="text"
                                name="lastname"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <ErrorMessage
                                name="lastname"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Pseudo:</label>
                            <Field
                                type="text"
                                name="username"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

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
                                    type={showPassword ? "text" : "password"} // Changer le type de champ
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirmez le mot de passe:</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                S'inscrire
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
