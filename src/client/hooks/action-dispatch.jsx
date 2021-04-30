
import { useDispatch } from 'react-redux';

export default (fn) => {
  const dispatch = useDispatch();
  return fn.bind(null, dispatch);
};
