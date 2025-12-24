import { toast } from "react-toastify";
import { checkEmail, checkPhone, FormatString } from '@/utils';

interface UserUpdateData {
    id: string | string[] | undefined;
    updateName: string;
    updatePhone: string;
    updateEmail: string;
    updateAddress: string;
    updateRole?: string;
    initialName: string;
    initialPhone: string;
    initialEmail: string;
    initialAddress: string;
    initialRole?: string;
}

interface UseUserUpdateOptions {
    onSuccess: () => void;
}

const fetcher = (url: string) =>
    fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((res) => res.json());

export const useUserUpdate = (options: UseUserUpdateOptions) => {
    const updateUser = async (data: UserUpdateData) => {
        const {
            id,
            updateName,
            updatePhone,
            updateEmail,
            updateAddress,
            updateRole,
            initialName,
            initialPhone,
            initialEmail,
            initialAddress,
            initialRole
        } = data;

        const formattedName = FormatString(updateName);
        const formattedAddress = FormatString(updateAddress);
        const formattedEmail = FormatString(updateEmail);
        const formattedPhone = FormatString(updatePhone);

        if (!formattedName || !formattedEmail || !formattedPhone || !formattedAddress) {
            toast.error('Không được để trống');
            return false;
        }
        if (!checkPhone(formattedPhone)) {
            toast.error('Hãy nhập số điện thoại hợp lệ');
            return false;
        }
        if (!checkEmail(formattedEmail)) {
            toast.error('Hãy nhập email hợp lệ');
            return false;
        }
        if (formattedAddress.trim().length < 5) {
            toast.error('Hãy nhập địa chỉ hợp lệ');
            return false;
        }

        try {
            const existingUser = await fetcher(`${process.env.NEXT_PUBLIC_USER_API}find?email=${formattedEmail}`);

            if (existingUser._id && existingUser._id !== id) {
                toast.error('Email đã được đăng ký');
                return false;
            }

            const updatedFields: { [key: string]: string | number } = {};
            if (formattedName !== initialName) updatedFields.name = formattedName;
            if (formattedPhone !== initialPhone) updatedFields.phone = parseInt(formattedPhone, 10);
            if (formattedEmail !== initialEmail) updatedFields.email = formattedEmail;
            if (formattedAddress !== initialAddress) updatedFields.address = formattedAddress;
            if (updateRole && updateRole !== initialRole) updatedFields.role = updateRole;

            if (Object.keys(updatedFields).length > 0) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API}update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        id,
                        ...updatedFields,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Update failed');
                }

                toast.success('Cập Nhật Thành Công');
                options.onSuccess();
                return true;
            } else {
                toast.info('Không có thay đổi nào để cập nhật');
                return false;
            }
        } catch (error) {
            console.error('Update Error:', error);
            toast.error('Cập Nhật Thất Bại');
            return false;
        }
    };

    return { updateUser };
};
