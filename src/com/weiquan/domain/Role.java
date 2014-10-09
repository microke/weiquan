package com.weiquan.domain;

public class Role {
	private long roleId;
	private String roleName;
	private int rolePower;
	
	public long getRoleId() {
		return this.roleId;
	}
	public void setRoleId(long roldId) {
		this.roleId = roldId;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public int getRolePower() {
		return rolePower;
	}
	public void setRolePower(int rolePower) {
		this.rolePower = rolePower;
	}
}
