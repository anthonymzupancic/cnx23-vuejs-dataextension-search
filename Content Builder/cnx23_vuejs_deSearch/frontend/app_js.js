const AppJS = {
  // Register Components
  components: {
    DataExtensionSearch,
    DataExtensionResults,
  },
  // Data function returns $data object
  data() {
    return {
      config: {
        apiBaseURL:
          "https://mct6kk2l3spmvz7h3-s46x07swk0.pub.sfmc-content.com/1udssm1fr4q",
      },
      dataExtensionReturn: [],
    };
  },
  methods: {
    submitSearch: async function (searchTerm) {
      try {
        if (!searchTerm) {
          return;
        }

        // Make ajax request to Code Resource page
        const requestDataExtensionSearch = await axios.post(
          `${this.config.apiBaseURL}?route=getDataExtensions`,
          {
            searchTerm,
          }
        );
          
        // Check to ensure there's data returned
        if (
          requestDataExtensionSearch &&
          requestDataExtensionSearch.data.status &&
          requestDataExtensionSearch.data.status === "ok" &&
          requestDataExtensionSearch.data.response &&
          requestDataExtensionSearch.data.response.length
        ) {
            this.dataExtensionReturn = requestDataExtensionSearch.data.response
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};

// Initiate/configuration of main Vue Application
const app = Vue.createApp(AppJS).mount("#app");
