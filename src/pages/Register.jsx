import React, { useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

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
        <div>
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
                    <Form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom:</label>
                            <Field
                                type="text"
                                name="name"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom:</label>
                            <Field
                                type="text"
                                name="lastname"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="lastname"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pseudo:</label>
                            <Field
                                type="text"
                                name="username"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmez le mot de passe:</label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                className="mt-1 block w-full border-gray-300 border-2 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                disabled={isSubmitting}
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
