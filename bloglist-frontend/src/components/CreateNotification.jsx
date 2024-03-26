const CreateNotification = ( { message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='create'>
      {message}
    </div>
  )
}

export default CreateNotification