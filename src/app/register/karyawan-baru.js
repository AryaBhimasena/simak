"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function KaryawanBaru({
  currentStep,
  totalSteps,
  formData,
  updateField,
  photoPreview,
  errorMessage,
  isLoading,
  handleNext,
  handlePrevious,
  handlePhotoChange,
  handleBackToTypeSelection,
  handleSubmit,
  StepProgress,
  StepOne,
  StepTwo,
  StepThree,
  Brand,
  Footer,

  /* =====================================================
     MASTER DATA STEP 2
  ===================================================== */

  kategoriTenagaKerjaOptions = [],
  jabatanOptions = [],
  penempatanOptions = [],
  isLoadingStepTwoOptions = false,
  stepTwoOptionsError = "",
}) {
  return (
    <main className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          <Brand />

          <div className="register-header">
            <p className="register-eyebrow">
              KARYAWAN BARU
            </p>

            <h1>
              Lengkapi data diri
            </h1>

            <p>
              Isi data secara bertahap untuk melengkapi pendaftaran Anda di
              SIMAK-KII.
            </p>
          </div>

          <StepProgress currentStep={currentStep} />

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >
            {currentStep === 1 && (
              <StepOne
                formData={formData}
                updateField={updateField}
                registrationType="baru"
              />
            )}

			{currentStep === 2 && (
			  <StepTwo
				formData={formData}
				updateField={updateField}
				kategoriTenagaKerjaOptions={kategoriTenagaKerjaOptions}
				jabatanOptions={jabatanOptions}
				penempatanOptions={penempatanOptions}
				isLoadingStepTwoOptions={isLoadingStepTwoOptions}
				stepTwoOptionsError={stepTwoOptionsError}
			  />
			)}

            {currentStep === 3 && (
              <StepThree
                foto={formData.foto}
                photoPreview={photoPreview}
                registrationType="baru"
                handlePhotoChange={handlePhotoChange}
              />
            )}

            {errorMessage && (
              <div
                className="register-error"
                role="alert"
                aria-live="polite"
              >
                {errorMessage}
              </div>
            )}

            <div className="register-navigation">
              {currentStep === 1 && (
                <button
                  type="button"
                  className="register-button register-button-secondary"
                  onClick={handleBackToTypeSelection}
                  disabled={isLoading}
                  aria-label="Ganti pilihan pendaftaran"
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={2}
                  />

                  <span>
                    Ganti pilihan
                  </span>
                </button>
              )}

              {currentStep > 1 && (
                <button
                  type="button"
                  className="register-button register-button-secondary"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  aria-label="Kembali ke langkah sebelumnya"
                >
                  <ArrowLeft
                    size={18}
                    strokeWidth={2}
                  />

                  <span>
                    Kembali
                  </span>
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  className="register-button"
                  onClick={handleNext}
                  disabled={
                    isLoading ||
                    (
                      currentStep === 2 &&
                      isLoadingStepTwoOptions
                    )
                  }
                >
                  <span>
                    Lanjutkan
                  </span>

                  <ArrowRight
                    size={19}
                    strokeWidth={2}
                  />
                </button>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  className="register-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>
                      Mengirim data...
                    </span>
                  ) : (
                    <>
                      <span>
                        Kirim pendaftaran
                      </span>

                      <CheckCircle2
                        size={19}
                        strokeWidth={2}
                      />
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="register-note">
              {currentStep === 1 && (
                "Lengkapi seluruh data pribadi dengan benar sebelum melanjutkan."
              )}

              {currentStep === 2 && (
                "Pastikan informasi kepegawaian yang dimasukkan sudah sesuai."
              )}

              {currentStep === 3 && (
                "Gunakan foto terbaru yang jelas dan mudah dikenali."
              )}
            </p>
          </form>

          <Footer />
        </div>
      </div>
    </main>
  );
}