const { createApp, ref, onMounted, computed } = Vue;
const app = createApp({
  setup() {
    const url = "http://localhost:8000/athlete";
    const athlete = ref({
      id: "",
      name: "",
      age: "",
      geup: "",
      list: [],
      isUpdate: false,
      errorMessage: "",
    });

    const isValid = computed(() => {
      return (
        athlete.value.name !== "" &&
        athlete.value.age !== "" &&
        athlete.value.geup !== ""
      );
    });
    const getAthlete = async () => {
      try {
        const resAthlete = await axios.get(url);
        if (resAthlete.data.length === 0) throw new Error("Data not found");
        athlete.value.isUpdate = false;
        athlete.value.list = resAthlete.data;
        return resAthlete.data;
      } catch (err) {
        athlete.value.isUpdate = false;
        athlete.value.errorMessage = err.message;
        console.log(athlete.value.errorMessage);
      }
    };

    const getAthleteById = async (id) => {
      try {
        const resAthlete = await axios.get(url + `/${id}`);
        if (resAthlete.data.length === 0) throw new Error("Data not found");
        athlete.value.isUpdate = true;
        athlete.value.id = id;
        athlete.value.name = resAthlete.data.name;
        athlete.value.age = resAthlete.data.age;
        athlete.value.geup = resAthlete.data.geup;
        return resAthlete.data;
      } catch (err) {
        athlete.value.isUpdate = false;
        athlete.value.id = "";
        athlete.value.name = "";
        athlete.value.age = "";
        athlete.value.geup = "";
        athlete.value.errorMessage = err.message;
        console.log(athlete.value.errorMessage);
      }
    };
    const deleteAthlete = async (id) => {
      try {
        const resAthlete = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resAthlete.data.length === 0) throw new Error("Data not found");
        athlete.value.list = resAthlete.data;
        athlete.value.isUpdate = false;
        await getAthlete();
        return resAthlete.data;
      } catch (err) {
        athlete.value.isUpdate = false;
        athlete.value.errorMessage = err.message;
        console.log(athlete.value.errorMessage);
      }
    };
    const submitAthlete = async () => {
      try {
        const resAthlete = await axios.post(url + "/create", {
          name: athlete.value.name,
          age: athlete.value.age,
          geup: athlete.value.geup,
        });
        if (!resAthlete) throw new Error("Failed to add data");
        athlete.value.isUpdate = false;
        athlete.value.errorMessage = "";
        athlete.value.name = "";
        athlete.value.age = "";
        athlete.value.geup = "";
        await getAthlete();
      } catch (err) {
        athlete.value.name = "";
        athlete.value.age = "";
        athlete.value.geup = "";
        athlete.value.isUpdate = false;
        athlete.value.errorMessage = err.message;
        console.log(athlete.value.errorMessage);
      }
    };
    const updateAthlete = async () => {
      try {
        const resAthlete = await axios.put(url + "/update", {
          id: athlete.value.id,
          name: athlete.value.name,
          email: athlete.value.email,
          nim: athlete.value.nim,
        });
        athlete.value.id = "";
        athlete.value.name = "";
        athlete.value.age = "";
        athlete.value.geup = "";
        athlete.value.isUpdate = false;
        if (!resAthlete) throw new Error("Failed to update data");
        await getAthlete();
      } catch (err) {
        athlete.value.isUpdate = false;
        athlete.value.errorMessage = err.message;
        console.log(athlete.value.errorMessage);
      }
    };

    onMounted(async () => {
      await getAthlete();
    });
    return {
      athlete,
      isValid,
      getAthlete,
      getAthleteById,
      deleteAthlete,
      submitAthlete,
      updateAthlete,
    };
  },
});

app.mount("#app");
