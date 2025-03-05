const LoadMoreDataBtn = ({ state, fetchDataFunc }) => {

    if (state != null && state.totalPosts > state.results.length) {
        return (
            <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 flex items-center gap-2"
                onClick={() => { fetchDataFunc({ page: state.page + 1 }) }}
            >
                Load more
            </button>
        )
    }
}

export default LoadMoreDataBtn