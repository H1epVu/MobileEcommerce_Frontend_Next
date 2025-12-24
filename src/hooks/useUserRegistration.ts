import { toast } from "react-toastify";
import { checkEmail, checkPhone } from '@/utils';

interface RegistrationData {
    name: string;
    phone: string;
    email: string;
    address: string;
    password: string;
    role: string;
}

interface UseUserRegistrationOptions {
    onSuccess: () => void;
}

export const useUserRegistration = (options: UseUserRegistrationOptions) => {
    const registerUser = async (data: RegistrationData) => {
        const { name, email, phone, address, password, role } = data;

        if (!name || !email || !phone || !password) {
            toast.error("Không được để trống");
            return false;
        }

        if (!checkEmail(email)) {
            toast.error("Email không đúng định dạng");
            return false;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}find?email=${email}`);
            const responseData = await response.json();

            if (response.ok) {
                if (responseData.user) {
                    toast.error('Email đã được đăng ký!');
                    return false;
                }
            } else if (response.status === 404) {

                if (!checkPhone(phone)) {
                    toast.error('Số điện thoại không hợp lệ');
                    return false;
                }

                const newUser = {
                    name: name,
                    phone: parseInt(phone, 10),
                    email: email,
                    address: address,
                    password: password,
                    role: role
                };

                const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_API}register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (registerResponse.ok) {
                    toast.success('Đăng ký thành công');
                    options.onSuccess();
                    return true;
                } else {
                    const errorData = await registerResponse.json();
                    toast.error(errorData.message || 'Đã xảy ra lỗi khi đăng ký.');
                    return false;
                }
            } else {
                toast.error(responseData.message || 'Đã xảy ra lỗi khi kiểm tra email.');
                return false;
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi kết nối.');
            console.error(error);
            return false;
        }

        return false;
    };

    return { registerUser };
};