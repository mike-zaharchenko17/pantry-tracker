const ItemUpdateModal = ({ isVisible, onClose, children }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-white bg-opacity-20 flex justify-center items-center z-10">
            <div className="w-[600px] marker:p-6- rounded relative">
                <button className="text-white text-lg absolute top-2 right-2" onClick={() => onClose()}>
                    X
                </button>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ItemUpdateModal;