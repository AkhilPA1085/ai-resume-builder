import Button from '@mui/material/Button';

function ActionButton({ variant = 'contained', onClick, loading, children }) {
    return <Button variant={variant} onClick={onClick} loading={loading}>{children}</Button>
}

export default ActionButton