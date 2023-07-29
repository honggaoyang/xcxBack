<template>
  <Form :is-edit="true" />
</template>

<script>
import Form from './components/Form'

export default {
  name: 'EditArticle',
  components: { Form }
}
</script>

