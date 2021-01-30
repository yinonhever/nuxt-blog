<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmit" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AdminPostForm from "@/components/Admin/AdminPostForm";

export default {
  middleware: ["check-auth", "auth"],
  components: { AdminPostForm },
  async asyncData(context) {
    try {
      const { data } = await axios.get(
        `https://nuxt-blog-f4cf3-default-rtdb.firebaseio.com/posts/${context.params.postid}.json`
      );
      return {
        loadedPost: { ...data, id: context.params.postid }
      };
    } catch (error) {
      context.error(error);
    }
  },
  methods: {
    async onSubmit(editedPost) {
      await this.$store.dispatch("editPost", editedPost);
      this.$router.push("/admin");
    }
  }
};
</script>
