<template>
  <Form :is-edit="false" />
</template>

<script>
import Form from './components/Form'

export default {
  name: 'AddArticle',
  components: { Form }
}
</script>

