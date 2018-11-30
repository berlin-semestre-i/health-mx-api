const DYNAMODB = process.env.DYNAMODB || `${process.env.STAGE}-CUP-API`

module.exports = {
  RoleTableName: `${DYNAMODB}.Role`,
  SessionTableName: `${DYNAMODB}.Session`,
  UserTableName: `${DYNAMODB}.User`,
}
