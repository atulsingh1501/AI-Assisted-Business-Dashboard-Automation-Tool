import './Spinner.css'

function Spinner({ size = 'medium', className = '' }) {
    const sizeClasses = {
        small: 'spinner-sm',
        medium: 'spinner-md',
        large: 'spinner-lg',
    }

    return (
        <div className={`spinner ${sizeClasses[size]} ${className}`}></div>
    )
}

export default Spinner
