variable "aws_region" {
  description = "The AWS region to deploy the resources."
  type        = string
  default     = "us-east-1"
}

variable "user_pool_name" {
  description = "The name of the Cognito User Pool."
  type        = string
  default     = "my-user-pool"
}