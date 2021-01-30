<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSubmit" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from "@/components/Admin/AdminPostForm";

export default {
  middleware: ["check-auth", "auth"],
  components: { AdminPostForm },
  methods: {
    async onSubmit(postData) {
      await this.$store.dispatch("addPost", postData);
      this.$router.push("/admin");
    }
  }
};
</script>
