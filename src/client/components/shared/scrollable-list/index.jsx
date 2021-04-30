import styled from 'styled-components';

const ScrollableList = styled.div`
@media (min-width: 0px) and (max-width: 567px) {
max-height: 230px;
min-height: 230px;
overflow-y: scroll;
}

@media (min-width: 568px) and (max-width: 767px) {
max-height: 400px;
min-height: 400px;
overflow-y: scroll;
}

@media (min-width: 768px) and (max-width: 1023px) {
max-height: 500px;
min-height: 500px;
overflow-y: scroll;
}

@media (min-width: 1024px) and (max-width: 1365px) {
max-height: 400px;
min-height: 400px;
overflow-y: scroll;
}
@media (min-width: 1366px) {
max-height: 400px;
min-height: 400px;
overflow-y: scroll;
}
`;

ScrollableList.displayName = 'ScrollableList';

export default ScrollableList;
