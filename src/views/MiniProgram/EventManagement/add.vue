<template>
  <Form :is-edit="false" />
</template>

<script>
import Form from './components/Form'

export default {
  name: 'AddEvent',
  components: { Form }
}
</script>

