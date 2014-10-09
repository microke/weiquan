package com.weiquan.domain;

import com.weiquan.domain.annotation.AttrAnnotation;

public class User extends SqlParam{
	private long userId; // '用户编号',
	private String name; // '用户名称',
	private String loginName;
    private VipLevel vipLevel; //'用户等级',
    private String password; //'密码  ',
    private int enabled; //'启用状态',
    private Role role;
    private long roleId; //'角色',
    private int validDate; //'有效期限',
    private int validCount; // '密码输入错误次数',
    private int type; //'类型 暂时不用',
    private String account; //'微信账号 ',
    private String telephone ; //'电话 暂时不用',
    private String email; // '邮箱 暂时不用',
    private String address; //'地址 暂时不用',
    
    @AttrAnnotation
    private String certType; //'证件类型 暂时不用',
    private String certNumber; //'证件号码 暂时不用',
    private String memo ; // '备注 暂时不用',
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getEnabled() {
		return enabled;
	}
	public void setEnabled(int enabled) {
		this.enabled = enabled;
	}
	public long getRoleId() {
		return roleId;
	}
	public void setRoleId(long roleId) {
		this.roleId = roleId;
	}
	public int getValidDate() {
		return validDate;
	}
	public void setValidDate(int validDate) {
		this.validDate = validDate;
	}
	public int getValidCount() {
		return validCount;
	}
	public void setValidCount(int validCount) {
		this.validCount = validCount;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCertType() {
		return certType;
	}
	public void setCertType(String certType) {
		this.certType = certType;
	}
	public String getCertNumber() {
		return certNumber;
	}
	public void setCertNumber(String certNumber) {
		this.certNumber = certNumber;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public Role getRole() {
		return role;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public VipLevel getVipLevel() {
		return vipLevel;
	}
	public void setVipLevel(VipLevel vipLevel) {
		this.vipLevel = vipLevel;
	}
}
