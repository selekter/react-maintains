import Button from "./Button.js";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <>
      <div
        className={`${isOpen ? "animate-openModal" : "animate-closeModal"
          } space-y-2`}
      >
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white w-11/12 md:max-w-screen-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="p-4 text-left max-h-[90vh]">
                {children}
                <div className="flex flex-col md:flex-row">
                  <Button
                    className="my-2 bg-stone-300 hover:bg-stone-400 hover:shadow-stone-400"
                    onClick={onClose}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Modal;
