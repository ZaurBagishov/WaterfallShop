import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "../../Redux/Slice/AuthSlice"
import PropTypes from 'prop-types'





const ShowOnLogin = ({children}) => {
    const isLoggedIn = useSelector(selectIsLoggedIn)
    return isLoggedIn ? children : null
}
ShowOnLogin.propTypes = {
    children: PropTypes.node.isRequired,
}

export const ShowOnLogOut = ({children}) => {
    const isLoggedIn = useSelector(selectIsLoggedIn)
    return isLoggedIn ? null : children
}
ShowOnLogOut.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ShowOnLogin
