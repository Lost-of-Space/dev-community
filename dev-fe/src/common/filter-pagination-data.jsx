import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {} }) => {

    let obj;

    if (state != null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data], page: page }
    } else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
            .then(({ data: { totalPosts } }) => {
                obj = { results: data, page: 1, totalPosts }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return obj;

}