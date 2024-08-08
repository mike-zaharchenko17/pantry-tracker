const ItemUpdateModal = ({ isVisible, onClose, children }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
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