import { useRef, useState, useCallback, useEffect } from "react";
import {
  validateNIK,
  formatNIK,
  validateZIP,
  formatZIP,
  validatePhone,
  formatPhone,
  validateEmail,
  validateAddress,
  type AddressData,
} from "@/utils/validation";
import { fetchAddressByZIP } from "@/utils/zippost";

const CHECKOUT_ADDRESS_STORAGE_KEY = "benangbaju_checkout_address";

import { CheckoutFormData } from "@/types/checkout";

interface UseCheckoutFormStateOptions {
  initialEmail?: string;
  onZIPChange?: (zip: string) => void;
}

export function useCheckoutFormState({
  initialEmail,
  onZIPChange,
}: UseCheckoutFormStateOptions) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<AddressData>({
    zip: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingZIP, setIsLoadingZIP] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const lastZipLookupRef = useRef<string>("");
  const hasLoadedFromStorageRef = useRef(false);

  // Muat alamat terakhir yang tersimpan saat mount
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedFromStorageRef.current) return;
    hasLoadedFromStorageRef.current = true;
    try {
      const cached = localStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached) as Partial<AddressData>;
      const zipDigits = (parsed.zip ?? "").replace(/\D/g, "");
      if (zipDigits.length !== 5) return;
      setAddress((prev) => ({
        ...prev,
        zip: formatZIP(zipDigits),
        street: parsed.street ?? "",
        number: parsed.number ?? "",
        complement: parsed.complement ?? "",
        neighborhood: parsed.neighborhood ?? "",
        city: parsed.city ?? "",
        state: parsed.state ?? "",
      }));
      onZIPChange?.(zipDigits);
    } catch {
      // Abaikan error parsing
    }
  }, [onZIPChange]);

  const lookupZIP = useCallback(
    async (zipDigits: string) => {
      if (!validateZIP(zipDigits)) return;
      if (isLoadingZIP) return;
      if (lastZipLookupRef.current === zipDigits) return;
      lastZipLookupRef.current = zipDigits;

      setIsLoadingZIP(true);
      setErrors((prev) => ({ ...prev, zip: "" }));

      try {
        const zipData = await fetchAddressByZIP(zipDigits);
        if (zipData) {
          setAddress((prev) => ({
            ...prev,
            street: zipData.street || "",
            neighborhood: zipData.neighborhood || "",
            city: zipData.city || "",
            state: zipData.state || "",
          }));
          setErrors((prev) => {
            const next = { ...prev };
            delete next.zip;
            delete next.street;
            delete next.neighborhood;
            delete next.city;
            delete next.state;
            return next;
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data kode pos:", error);
      } finally {
        setIsLoadingZIP(false);
      }
    },
    [isLoadingZIP],
  );

  const handleZIPBlur = useCallback(async () => {
    const cleanedZIP = address.zip.replace(/\D/g, "");
    if (cleanedZIP.length !== 5) return;
    await lookupZIP(cleanedZIP);
  }, [address.zip, lookupZIP]);

  const validateField = useCallback(
    (field: string, value: string | AddressData) => {
      const newErrors: Record<string, string> = { ...errors };

      switch (field) {
        case "nik":
          if (!value || (value as string).trim().length === 0) {
            newErrors.nik = "NIK wajib diisi";
          } else if (!validateNIK(value as string)) {
            newErrors.nik = "NIK tidak valid (harus 16 digit)";
          } else {
            delete newErrors.nik;
          }
          break;
        case "fullName":
          if (!value || (value as string).trim().length === 0) {
            newErrors.fullName = "Nama lengkap wajib diisi";
          } else if ((value as string).trim().length < 3) {
            newErrors.fullName = "Nama lengkap minimal 3 karakter";
          } else {
            delete newErrors.fullName;
          }
          break;
        case "phone":
          if (!value || (value as string).trim().length === 0) {
            newErrors.phone = "Nomor WhatsApp wajib diisi";
          } else if (!validatePhone(value as string)) {
            newErrors.phone = "Nomor tidak valid (10-13 digit)";
          } else {
            delete newErrors.phone;
          }
          break;
        case "email":
          if (!value || (value as string).trim().length === 0) {
            newErrors.email = "Email wajib diisi";
          } else if (!validateEmail((value as string).trim())) {
            newErrors.email = "Email tidak valid";
          } else {
            delete newErrors.email;
          }
          break;
        case "address": {
          const addrValidation = validateAddress(value as AddressData);
          if (!addrValidation.valid) {
            addrValidation.errors.forEach((error) => {
              if (error.includes("Kode Pos")) newErrors.zip = error;
              else if (error.includes("Alamat")) newErrors.street = error;
              else if (error.includes("Nomor")) newErrors.number = error;
              else if (error.includes("Kecamatan")) newErrors.neighborhood = error;
              else if (error.includes("Kota")) newErrors.city = error;
              else if (error.includes("Provinsi")) newErrors.state = error;
            });
          } else {
            ["zip", "street", "number", "neighborhood", "city", "state"].forEach(
              (k) => delete newErrors[k],
            );
          }
          break;
        }
      }

      setErrors(newErrors);
    },
    [errors],
  );

  const handleNIKChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 16) {
        setNik(formatNIK(cleaned));
        if (touched.nik) validateField("nik", cleaned);
      }
    },
    [touched.nik, validateField],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 13) {
        setPhone(formatPhone(cleaned));
        if (touched.phone) validateField("phone", cleaned);
      }
    },
    [touched.phone, validateField],
  );

  const handleZIPChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, "").slice(0, 5);
      const formatted = formatZIP(cleaned);
      setAddress((prev) => ({ ...prev, zip: formatted }));
      onZIPChange?.(cleaned);
      if (cleaned.length === 5) {
        setTouched((prev) => ({ ...prev, zip: true }));
        validateField("address", { ...address, zip: cleaned });
        void lookupZIP(cleaned);
      } else if (touched.zip) {
        validateField("address", { ...address, zip: cleaned });
      }
    },
    [address, onZIPChange, touched.zip, validateField, lookupZIP],
  );

  const validateStepDetails = useCallback(() => {
    const allTouched: Record<string, boolean> = {
      fullName: true,
      email: true,
      phone: true,
      zip: true,
      street: true,
      number: true,
      neighborhood: true,
      city: true,
      state: true,
    };
    setTouched(allTouched);

    const emailValue = (initialEmail ?? email).trim().toLowerCase();
    const fullNameValid = fullName.trim().length >= 3;
    const emailValid = validateEmail(emailValue);
    const phoneValid = validatePhone(phone);
    const addressValidation = validateAddress(address);

    const newErrors: Record<string, string> = {};
    if (!fullNameValid) {
      newErrors.fullName =
        fullName.trim().length === 0
          ? "Nama lengkap wajib diisi"
          : "Nama lengkap minimal 3 karakter";
    }
    if (!emailValid) {
      newErrors.email =
        !emailValue ? "Email wajib diisi" : "Email tidak valid";
    }
    if (!phoneValid) {
      newErrors.phone =
        !phone.trim() ? "Nomor WhatsApp wajib diisi" : "Nomor tidak valid";
    }
    if (!addressValidation.valid) {
      addressValidation.errors.forEach((error) => {
        if (error.includes("Kode Pos")) newErrors.zip = error;
        else if (error.includes("Alamat")) newErrors.street = error;
        else if (error.includes("Nomor")) newErrors.number = error;
        else if (error.includes("Kecamatan")) newErrors.neighborhood = error;
        else if (error.includes("Kota")) newErrors.city = error;
        else if (error.includes("Provinsi")) newErrors.state = error;
      });
    }

    setErrors((prev) => {
      const next = { ...prev };
      const keysToReset = [
        "fullName", "email", "phone",
        "zip", "street", "number", "neighborhood", "city", "state",
      ] as const;
      keysToReset.forEach((k) => delete next[k]);
      return { ...next, ...newErrors };
    });

    return fullNameValid && emailValid && phoneValid && addressValidation.valid;
  }, [fullName, email, phone, address, initialEmail]);

  const touchField = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const updateAddressField = useCallback(
    (field: keyof AddressData, value: string, currentAddress: AddressData) => {
      setAddress((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        validateField("address", { ...currentAddress, [field]: value });
      }
    },
    [touched, validateField],
  );

  return {
    // State
    email,
    setEmail,
    fullName,
    setFullName,
    nik,
    phone,
    address,
    setAddress,
    errors,
    isLoadingZIP,
    touched,
    // Handler
    handleNIKChange,
    handlePhoneChange,
    handleZIPChange,
    handleZIPBlur,
    validateField,
    validateStepDetails,
    touchField,
    updateAddressField,
  };
}

