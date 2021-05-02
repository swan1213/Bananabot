import ApolloClient, { createNetworkInterface } from 'apollo-client';
import Cookies from 'cookies-js';

const networkInterface = createNetworkInterface({
    uri: window.GRAPHQL_ENDPOINT
});
// const networkInterface = createNetworkInterface({
//     uri: 'http://localhost:9000/graphql/'
// });

networkInterface.use([{
    applyMiddleware(req, next) {
        const token = Cookies.get("BB_AUTH_TOKEN");
        if (token) {
            if (!req.options.headers) {
                req.options.headers = {};
            }
            req.options.headers['Authorization'] = `JWT ${token}`;
        }
        next();
    }
}]);

const dataIdFromObject = result => {
    if (result.id && result.__typename) {
        return result.__typename + result.id;
    }

    // Make sure to return null if this object doesn't have an ID
    return null;
}

const client = new ApolloClient({networkInterface, dataIdFromObject});

export default client;
