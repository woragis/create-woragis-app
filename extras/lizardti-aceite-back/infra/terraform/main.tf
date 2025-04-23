module "cognito" {
  source = "git::https://github.com/woragis/terraform-cognito.git//?ref=v1"

  aws_region        = var.aws_region
  cognito_name      = var.cognito_name
  cognito_user_pool = var.cognito_user_pool
}

module "serverless" {
  source = "git::https://github.com/woragis/terraform-serverless.git//?ref=v1"

  aws_region  = var.aws_region
  server_name = var.server_name
}